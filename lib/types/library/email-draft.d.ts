export type DraftContact = {
    name: string;
    email: string;
};
export type DraftTone = {
    id: string;
    label: string;
    body: (contact: DraftContact) => string;
};
export type EmailDraftProps = {
    /** Reference of the record, e.g. a subscription or invoice number */
    reference?: string;
    /** Account or company under the reference */
    account?: string;
    /** Amount shown on the right */
    amount?: string;
    /** Status chip next to the reference */
    status?: string;
    /** Who wrote the draft */
    agent?: string;
    contacts?: DraftContact[];
    attachment?: string | null;
    /** Text variants to switch between – the first one is shown first */
    tones?: DraftTone[];
    /** Label and target of the link appended to the email */
    link?: {
        label: string;
        href: string;
    };
    onSend?: (email: {
        to: DraftContact;
        body: string;
        attachment: string | null;
    }) => void;
    onDiscard?: () => void;
    className?: string;
};
export declare function EmailDraft({ reference, account, amount, status, agent, contacts, attachment, tones, link, onSend, onDiscard, className, }: EmailDraftProps): import("react").JSX.Element;
/** Working example; use the named EmailDraft export in your application. */
export default function Demo(): import("react").JSX.Element;
