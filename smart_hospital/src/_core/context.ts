export type TrpcContext = {
  req: any;
  res: any;
  user?: { id: number; role: string; openId: string; name?: string };
};
