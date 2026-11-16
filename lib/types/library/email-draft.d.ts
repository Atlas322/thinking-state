export type DraftContact = {
    name: string;
    email: string;
};
export type DraftTone = {
    id: string;
    label: string;
    body: (contact: DraftContact) => string;
};
/** The draft's own state – shown in the header chip with a Mongolian label and a status tone */
export type DraftStatus = "draft" | "scheduled" | "sent" | "failed";
export type DraftLink = {
    label: string;
    href: string;
};
export type EmailDraftProps = {
    /** Reference of the record, e.g. a subscription or invoice number */
    reference?: string;
    /** Account or company under the reference */
    account?: string;
    /** Amount shown on the right */
    amount?: string;
    /** Status chip next to the reference – a DraftStatus key gets its label and tone, any other text shows as is */
    status?: DraftStatus | (string & {});
    /** Who wrote the draft */
    agent?: string;
    contacts?: DraftContact[];
    attachment?: string | null;
    /** Text variants to switch between – the first one is shown first */
    tones?: DraftTone[];
    /** Label and target of the link appended to the email – null hides the link */
    link?: DraftLink | null;
    /** Milliseconds between pressing Send and onSend – the window to change one's mind (default 900) */
    sendDelay?: number;
    /** Send button text. Default «Имэйл илгээх». */
    sendLabel?: string;
    /** Discard button text. Default «Хаях». */
    discardLabel?: string;
    onSend?: (email: {
        to: DraftContact;
        body: string;
        attachment: string | null;
    }) => void;
    onDiscard?: () => void;
    className?: string;
};
export declare function EmailDraft({ reference, account, amount, status, agent, contacts, attachment, tones, link, sendDelay, sendLabel, discardLabel, onSend, onDiscard, className, }: EmailDraftProps): import("react").JSX.Element;
/** Working example; use the named EmailDraft export in your application. */
export default function Demo(): import("react").JSX.Element;
