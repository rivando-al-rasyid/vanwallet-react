import { getBalance, updateBalance } from "./balanceUtils";
import { createTransaction } from "./transactionUtils";

export async function applyTransactionWithBalanceUpdate({
  userId,
  transactionType,
  transactionDesc,
  amount,
  balanceMutation,
}) {
  await createTransaction({
    userId,
    transactionType,
    transactionDesc,
    amount,
  });

  const currentBalanceData = await getBalance(userId);
  const currentBalance = currentBalanceData?.balance ?? 0;
  const nextBalance = balanceMutation(currentBalance);

  await updateBalance(userId, nextBalance);

  return { previousBalance: currentBalance, nextBalance };
}
