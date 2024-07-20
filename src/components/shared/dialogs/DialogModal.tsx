import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";

const DialogModal = ({ triggere, children }: any) => {
  return (
    <Dialog modal>
      <DialogTrigger asChild>{triggere}</DialogTrigger>
      <DialogContent className="">{children}</DialogContent>
    </Dialog>
  );
};

export default DialogModal;
