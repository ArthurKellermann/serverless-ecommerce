import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export async function callLocalLambda(FunctionName, Payload = {}) {
  const client = new LambdaClient({
    endpoint: 'http://localhost:3000',
    region: 'local', 
  });

  const command = new InvokeCommand({
    FunctionName,
    Payload: JSON.stringify(Payload),
  });

  try {
    const data = await client.send(command);
    return JSON.parse(Buffer.from(data.Payload!).toString());
  } catch (error) {
    console.log(error);
    return false;
  }
}
