import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className = "", ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={`fixed inset-0 z-50 bg-slate-900/40 ${className}`} {...props} />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg ${className}`} {...props} />
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className = "", ...props }) => <div className={`flex flex-col space-y-1.5 ${className}`} {...props} />;
const DialogFooter = ({ className = "", ...props }) => <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />;
const DialogTitle = React.forwardRef(({ className = "", ...props }, ref) => <DialogPrimitive.Title ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />);
DialogTitle.displayName = "DialogTitle";
const DialogDescription = React.forwardRef(({ className = "", ...props }, ref) => <DialogPrimitive.Description ref={ref} className={`text-sm text-slate-600 ${className}`} {...props} />);
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
