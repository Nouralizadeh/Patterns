import { createContext, useContext, useState, ReactNode } from "react";

/* -------------------------------------------------------
   Types
-------------------------------------------------------- */

type AccordionContextType = {
  openIndex: number | null;
  toggle: (index: number) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

/* -------------------------------------------------------
   Props
-------------------------------------------------------- */

type AccordionProps = {
  children: ReactNode;
};

type AccordionItemProps = {
  children: ReactNode;
  index: number;
};

type AccordionHeaderProps = {
  children: ReactNode;
  index: number;
};

type AccordionBodyProps = {
  children: ReactNode;
  index: number;
};

/* -------------------------------------------------------
   Root Component Type (Compound)
-------------------------------------------------------- */

type AccordionComponent = {
  (props: AccordionProps): JSX.Element;
  Item: (props: AccordionItemProps) => JSX.Element;
  Header: (props: AccordionHeaderProps) => JSX.Element;
  Body: (props: AccordionBodyProps) => JSX.Element;
};

/* -------------------------------------------------------
   Root Component
-------------------------------------------------------- */

const Accordion = (({ children }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <AccordionContext.Provider value={{ openIndex, toggle }}>
      <div className="w-96 border rounded shadow bg-white">{children}</div>
    </AccordionContext.Provider>
  );
}) as AccordionComponent;

/* -------------------------------------------------------
   Item
-------------------------------------------------------- */

function AccordionItem({ children }: AccordionItemProps) {
  return <div className="border-b last:border-b-0">{children}</div>;
}

/* -------------------------------------------------------
   Header
-------------------------------------------------------- */

function AccordionHeader({ children, index }: AccordionHeaderProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Must be inside Accordion");

  const { openIndex, toggle } = context;

  return (
    <button
      onClick={() => toggle(index)}
      className="w-full text-left px-4 py-3 font-semibold hover:bg-gray-100 flex justify-between"
    >
      {children}
      <span>{openIndex === index ? "−" : "+"}</span>
    </button>
  );
}

/* -------------------------------------------------------
   Body
-------------------------------------------------------- */

function AccordionBody({ children, index }: AccordionBodyProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Must be inside Accordion");

  const { openIndex } = context;

  if (openIndex !== index) return null;

  return <div className="px-4 py-3 text-gray-700 bg-gray-50">{children}</div>;
}

/* -------------------------------------------------------
   Attach Subcomponents
-------------------------------------------------------- */

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Body = AccordionBody;

/* -------------------------------------------------------
   Demo
-------------------------------------------------------- */

export default function CompoundComponentDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Accordion>
        <Accordion.Item index={0}>
          <Accordion.Header index={0}>
            What is Compound Pattern?
          </Accordion.Header>
          <Accordion.Body index={0}>
            It allows multiple components to share implicit state through
            context.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item index={1}>
          <Accordion.Header index={1}>Why is it powerful?</Accordion.Header>
          <Accordion.Body index={1}>
            It creates a clean declarative API similar to native HTML.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
