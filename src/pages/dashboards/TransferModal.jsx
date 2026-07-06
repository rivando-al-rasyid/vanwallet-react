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
import {
  createTransfer,
  resetTransfer,
} from "../../store/slices/transactionSlice";
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
  const transferStatus = useSelector(
    (state) => state.transaction.transfer.status,
  );

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
      <div className="mb-6 sm:mb-8">
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <span className="text-primary">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </span>
          <h1 className="text-base-content text-lg font-black">
            Transfer Money
          </h1>
        </div>
        <Stepper currentStep={3} />
      </div>

      {/* Summary card */}
      <div className="border-base-300 bg-base-100 mb-6 min-w-0 rounded-[1.5rem] border p-4 shadow-sm sm:p-6">
        <h2 className="text-base-content mb-4 text-lg font-black">
          Transfer Summary
        </h2>
        <div className="bg-base-200 flex flex-col gap-3 rounded-xl p-4">
          <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
            <span className="text-base-content/65">Recipient</span>
            <span className="text-base-content font-semibold break-words sm:text-right">
              {contact.name}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
            <span className="text-base-content/65">Phone / Email</span>
            <span className="text-base-content font-semibold break-all sm:text-right">
              {contact.phone || contact.email}
            </span>
          </div>
          <div className="border-base-300 flex flex-col gap-1 border-t pt-3 text-sm font-bold sm:flex-row sm:justify-between">
            <span className="text-base-content">Amount</span>
            <span className="text-primary break-words sm:text-right">
              {formatRupiah(amount)}
            </span>
          </div>
          {note && (
            <div className="flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
              <span className="text-base-content/65">Note</span>
              <span className="text-base-content/80 break-words sm:text-right">
                {note}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* PIN Modal */}
      <Modal open={modalStep === MODAL_STEP.PIN}>
        <p className="text-base-content/50 mb-4 text-left text-xs font-semibold tracking-widest uppercase">
          Transfer to {contact.name}
        </p>
        <h3 className="mb-1 text-left text-2xl font-bold">Enter Your Pin 👋</h3>
        <p className="text-base-content/50 mb-8 text-left text-sm">
          Enter your 6-digit PIN to confirm this transfer
        </p>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handlePinSubmit)}
            className="mb-2"
          >
            <div className="mb-8 flex w-full justify-center">
              <PinInput autoComplete="current-password" />
            </div>

            {methods.formState.errors.pin && (
              <p className="text-error mb-4 text-sm">
                Masukkan PIN lengkap ({PIN_LENGTH} digit)
              </p>
            )}

            {errorMsg && <p className="text-error mb-4 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 mb-4 w-full rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Confirm & Transfer"}
            </button>
          </form>
        </FormProvider>

        <button
          onClick={() => navigate(-1)}
          className="text-base-content/50 hover:text-base-content/75 w-full text-sm"
        >
          ← Back
        </button>
      </Modal>

      {/* Failed Modal */}
      <Modal open={modalStep === MODAL_STEP.FAILED}>
        <img
          src={transferFailedImage}
          alt="failed"
          className="mx-auto mb-4 h-auto max-h-40 w-auto"
        />
        <h3 className="text-base-content mb-2 text-lg font-black">
          Oops Transfer <span className="text-error">Failed</span>
        </h3>
        <p className="text-error mb-2 text-sm">{errorMsg}</p>
        <p className="text-base-content/50 mb-8 text-sm">
          Sorry, there is an issue with your transfer. Try again!
        </p>
        <button
          onClick={handleTryAgain}
          className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 mb-3 w-full rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-60"
        >
          Try Again
        </button>
        <button
          onClick={handleDone}
          className="border-primary text-primary w-full rounded-xl border py-3.5"
        >
          Back To Dashboard
        </button>
      </Modal>

      {/* Success Modal */}
      <Modal open={modalStep === MODAL_STEP.SUCCESS}>
        <img
          src={transferSuccessImage}
          alt="success"
          className="mx-auto mb-4 h-auto max-h-40 w-auto"
        />
        <h3 className="text-base-content mb-2 text-lg font-black">
          Yeay Transfer <span className="text-success">Success</span>
        </h3>
        <p className="text-base-content/50 mb-8 text-sm">
          {formatRupiah(amount)} berhasil dikirim ke {contact.name}.
        </p>
        <button
          onClick={handleDone}
          className="from-primary to-secondary shadow-primary/20 hover:from-primary/90 hover:to-secondary/90 mb-3 w-full rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-60"
        >
          Done
        </button>
        <button
          onClick={handleTransferAgain}
          className="border-primary text-primary w-full rounded-xl border py-3.5"
        >
          Transfer Again
        </button>
      </Modal>
    </>
  );
}
