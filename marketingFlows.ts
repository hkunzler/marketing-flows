export enum ActionType {
    TIME_DELAY = 'delay',
    SEND_EMAIL = 'email'
}

export interface IAction {
    delay?: number;
    email?: {
        body: string;
        subject: string;
    };
    id: string;
    type: ActionType;
}

export interface IFlow {
    actions: IAction[];
    trigger: string;
    userEmail: string;
}

const twoHours: number = 2 ;
export const marketingFlows: IFlow[] = [
    {
        actions: [
            {
                delay: twoHours,
                id: 'action1',
                type: ActionType.TIME_DELAY,
            },
            {
                email: {
                    body: 'Need some socks?',
                    subject: 'Welcome!'
                },
                id: 'action2',
                type: ActionType.SEND_EMAIL
            }
        ],
        trigger: 'websiteSignup',
        userEmail: 'harmony@healthtech1.uk'
    },
    {
        actions: [
            {
                email: {
                    body: 'Thank you!',
                    subject: 'Payment received'
                },
                id: 'action1',
                type: ActionType.SEND_EMAIL
            },
            {
                email: {
                    body: 'Get ready!',
                    subject: 'Socks dispatched'
                },
                id: 'action2',
                type: ActionType.SEND_EMAIL
            }
        ],
        trigger: 'socksPurchased',
        userEmail: 'john_snow@healthtech1.uk'
    }
];