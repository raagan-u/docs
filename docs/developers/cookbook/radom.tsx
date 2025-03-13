import { useGarden } from "@gardenfi/react-hooks";
const TokenSwap = () => {
  const { swapAndInitiate } = useGarden();
  const performSwap = async (strategyId: string, receiveAmount: string) => {
    const response = await swapAndInitiate({
      fromAsset: swapParams.fromAsset,
      toAsset: swapParams.toAsset,
      sendAmount,
      receiveAmount,
      additionalData: {
        btcAddress,
        strategyId,
      },
    });
    console.log(response);
    return response;
  };
};
