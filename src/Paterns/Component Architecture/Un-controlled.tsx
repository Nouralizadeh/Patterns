import { useState, ReactNode } from "react";

type AccordionRenderFn = (
  openIndex: number | null,
  setOpenIndex: (index: number | null) => void,
) => ReactNode;

type AccordionProps = {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  children: AccordionRenderFn;
};

export function Accordion({
  value,
  defaultValue = null,
  onChange,
  children,
}: AccordionProps) {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<number | null>(
    defaultValue,
  );

  const openIndex = isControlled ? value : internalValue;

  const setOpenIndex = (index: number | null) => {
    if (isControlled) {
      onChange?.(index);
    } else {
      setInternalValue(index);
    }
  };

  return (
    <div className="border rounded w-80 p-2">
      {children(openIndex, setOpenIndex)}
    </div>
  );
}

/* ------------------------------------------------------- */
/* Demo */
/* ------------------------------------------------------- */

export default function Un_ControlledDemo() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="main-container">
      {/* Uncontrolled */}
      <div className="flex-1">
        <span>Uncontrolled</span>
        <Accordion defaultValue={0}>
          {(openIndex, setOpenIndex) => (
            <>
              <button onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}>
                Item 1
              </button>

              {openIndex === 0 && <div>Content 1</div>}
            </>
          )}
        </Accordion>
      </div>

      {/* Controlled */}
      <div className="flex-1">
        <span>Controlled</span>
        <Accordion value={open} onChange={setOpen}>
          {(openIndex, setOpenIndex) => (
            <>
              <button onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}>
                Item 1
              </button>

              {openIndex === 0 && <div>Content</div>}
            </>
          )}
        </Accordion>
      </div>
    </div>
  );
}
