

export const EmailConfig = {
    key: 'emails',
    label: () => <span class="text-lg font-normal">EMAILS CONFIG</span>,
    type: 'object',
    size: '8',
    collapsed: true,
    fields: [
        {
            key: 'examConvocation',
            fieldParams: { frameless: true },
            type: 'object',
            size: 8,
            fields: [
                { key: 'active', label: 'Enable exam convocation email', type: 'checkbox', size: 8, description: 'Email sent to the candidate as an invitation to take the exam.' },
                // {
                //     type: 'info',
                //     dependencies: ['emails.examConvocation', 'test_name', 'general.examLogo'],
                //     condition: ({ 'emails.examConvocation': email }: any) => email.active,
                //     content: ({ 'emails.examConvocation': email, 'general.examLogo': examLogo, test_name }: any) => <EmailPreview examLogo={examLogo} examName={test_name} templateKey="exam_assigned" contentSlot={email.content}><NButton>OPEN EXAM PREVIEW</NButton></EmailPreview>
                // },
                // { key: 'content', label: 'Exam convocation custom content', type: 'custom-component', component: BaseEditor, size: 8, dependencies: ['emails.examConvocation.active'], condition: ({ 'emails.examConvocation.active': enable }) => !!enable, description: 'Text dedicated to the personalization of the invitation email.' },
            ]
        },
        {
            key: 'examDone',
            type: 'object',
            size: 8,
            fieldParams: { frameless: true },
            fields: [
                { key: 'active', label: 'Enable exam done email', type: 'checkbox', size: 8, description: 'Email sent when the exam has been completed and offering access to the results platform.' },
                // {
                //     type: 'info',
                //     dependencies: ['emails.examDone', 'test_name', 'general.examLogo'],
                //     condition: ({ 'emails.examDone': email }: any) => email.active,
                //     content: ({ 'general.examLogo': examLogo, test_name }: any) => <EmailPreview examLogo={examLogo} examName={test_name} templateKey="exam_done" contentSlot=""><NButton>OPEN EXAM PREVIEW</NButton></EmailPreview>
                // }
            ]
        },
        {
            key: 'examSecurityCompromised',
            type: 'object',
            size: 8,
            fieldParams: { frameless: true },
            fields: [
                { key: 'active', label: 'Enable exam security compromised email', type: 'checkbox', size: 8, description: 'Email sent to the candidate if VTEST confirms that the security of the exam has been compromised when using online proctoring.' },
                // {
                //     type: 'info',
                //     dependencies: ['emails.examSecurityCompromised', 'test_name', 'general.examLogo'],
                //     // label: 'Exam convocation preview',
                //     condition: ({ 'emails.examSecurityCompromised': email }: any) => email.active,
                //     content: ({ 'general.examLogo': examLogo, test_name }: any) => <EmailPreview examLogo={examLogo} examName={test_name} templateKey="exam_security_compromised" contentSlot=""><NButton>OPEN EXAM PREVIEW</NButton></EmailPreview>
                // }
            ]
        }

    ]
}