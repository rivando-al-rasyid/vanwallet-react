/**
 * TransferModal.jsx
 *
 * Confirmation modal for the transfer flow (Step 3).
 * Receives contact + amount + note from route state,
 * calls POST /transactions/transfer with PIN.
 *
 * Route: /dashboard/transfer/:walletId/confirm
 */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import PinInput from "../../components/PinInput";
import Modal from "../../components/Modal";
import Stepper from "../../components/Stepper";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../../utils/api";
import { createTransfer, resetTransfer } from "../../store/slices/transactionSlice";
import transferFailedImage from "../../assets/img/failed.png";
import transferSuccessImage from "../../assets/img/success.png";

const PIN_LENGTH = 6;
const defaultPin = Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

const pinSchema = Joi.object({
  pin: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().length(1).pattern(/^\d$/).required(),
      }),
    )
    .length(PIN_LENGTH)
    .required(),
});

const MODAL_STEP = { PIN: "pin", SUCCESS: "success", FAILED: "failed" };

export default function TransferModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const transferStatus = useSelector((state) => state.transaction.transfer.status);

  const contact = location.state?.contact;
  const amount = location.state?.amount;
  const note = location.state?.note || "";

  const [modalStep, setModalStep] = useState(MODAL_STEP.PIN);
  const [errorMsg, setErrorMsg] = useState("");
  const loading = transferStatus === "loading";

  const methods = useForm({
    resolver: joiResolver(pinSchema),
    defaultValues: { pin: defaultPin },
    mode: "onChange",
  });

  // Guard: if navigated without state, go back
  if (!contact || !amount) {
    navigate("/dashboard/transfer", { replace: true });
    return null;
  }

  /**
   * POST /transactions/transfer
   */
  const handlePinSubmit = async ({ pin }) => {
    const pinValue = pin.map((p) => p.value).join("");
    setErrorMsg("");
    try {
      await dispatch(
        createTransfer({
          senderWalletId: user?.walletId,
          recipientWalletId: contact.walletId,
          amount,
          note,
          pin: pinValue,
        }),
      ).unwrap();
      setModalStep(MODAL_STEP.SUCCESS);
    } catch (err) {
      setErrorMsg(err || "Transfer gagal.");
      setModalStep(MODAL_STEP.FAILED);
    }
  };

  const handleTryAgain = () => {
    dispatch(resetTransfer());
    methods.reset({ pin: defaultPin });
    setErrorMsg("");
    setModalStep(MODAL_STEP.PIN);
  };

  const handleDone = () => navigate("/dashboard");
  const handleTransferAgain = () => navigate("/dashboard/transfer");

  return (
    <>
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </span>
          <h1 className="section-title">Transfer Money</h1>
        </div>
        <Stepper currentStep={3} />
      </div>

      {/* Summary card */}
      <div className="card bg-base-100 border border-base-200 shadow-sm mb-6">
        <h2 className="section-title mb-4">Transfer Summary</h2>
        <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Recipient</span>
            <span className="font-semibold text-gray-800">{contact.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phone / Email</span>
            <span className="font-semibold text-gray-800">
              {contact.phone || contact.email}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 text-sm font-bold">
            <span className="text-gray-800">Amount</span>
            <span className="text-blue-600">{formatRupiah(amount)}</span>
          </div>
          {note && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Note</span>
              <span className="text-gray-700">{note}</span>
            </div>
          )}
        </div>
      </div>

      {/* PIN Modal */}
      <Modal open={modalStep === MODAL_STEP.PIN}>
        <p className="mb-4 text-left text-xs font-semibold tracking-widest text-gray-400 uppercase">
          Transfer to {contact.name}
        </p>
        <h3 className="mb-1 text-left text-2xl font-bold">Enter Your Pin 👋</h3>
        <p className="mb-8 text-left text-sm text-gray-400">
          Enter your 6-digit PIN to confirm this transfer
        </p>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handlePinSubmit)} className="mb-2">
            <div className="mb-8 flex justify-center">
              <PinInput />
            </div>

            {methods.formState.errors.pin && (
              <p className="mb-4 text-sm text-red-500">
                Masukkan PIN lengkap ({PIN_LENGTH} digit)
              </p>
            )}

            {errorMsg && (
              <p className="mb-4 text-sm text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary mb-4 w-full"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Confirm & Transfer"}
            </button>
          </form>
        </FormProvider>

        <button
          onClick={() => navigate(-1)}
          className="w-full text-sm text-gray-400 hover:text-gray-600"
        >
          ← Back
        </button>
      </Modal>

      {/* Failed Modal */}
      <Modal open={modalStep === MODAL_STEP.FAILED}>
        <img src={transferFailedImage} alt="failed" className="mx-auto mb-4" />
        <h3 className="section-title mb-2">
          Oops Transfer <span className="text-red-500">Failed</span>
        </h3>
        <p className="mb-2 text-sm text-red-400">{errorMsg}</p>
        <p className="mb-8 text-sm text-gray-400">
          Sorry, there is an issue with your transfer. Try again!
        </p>
        <button onClick={handleTryAgain} className="btn btn-primary mb-3 w-full">
          Try Again
        </button>
        <button
          onClick={handleDone}
          className="w-full rounded-xl border border-blue-600 py-3.5 text-blue-600"
        >
          Back To Dashboard
        </button>
      </Modal>

      {/* Success Modal */}
      <Modal open={modalStep === MODAL_STEP.SUCCESS}>
        <img src={transferSuccessImage} alt="success" className="mx-auto mb-4" />
        <h3 className="section-title mb-2">
          Yeay Transfer <span className="text-green-500">Success</span>
        </h3>
        <p className="mb-8 text-sm text-gray-400">
          {formatRupiah(amount)} berhasil dikirim ke {contact.name}.
        </p>
        <button onClick={handleDone} className="btn btn-primary mb-3 w-full">
          Done
        </button>
        <button
          onClick={handleTransferAgain}
          className="w-full rounded-xl border border-blue-600 py-3.5 text-blue-600"
        >
          Transfer Again
        </button>
      </Modal>
    </>
  );
}
