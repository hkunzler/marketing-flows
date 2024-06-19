import express from 'express';
import {ActionType, IAction, IFlow, marketingFlows} from './marketingFlows';

const app = express();

app.use(express.json());

const sendEmail = async (): Promise<boolean> => {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Simulating an asynchronous operation, e.g., sending an email
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 95% chance to return true, 5% chance to return false - emails fail
    return randomNumber < 0.95 ? true : false;
};

const executeActions = async (actions: IAction[], userEmail: string): Promise<void> => {
    for (const action of actions) {
        try {
            switch (action.type) {
                case ActionType.TIME_DELAY:
                    await new Promise(resolve => setTimeout(resolve, action.delay));
                    break;
                case ActionType.SEND_EMAIL:
                    if (action.email && userEmail) await sendEmail();
                    break;
                default:
                    console.warn(`Unknown action type: ${action.type}`);
                    break;
            }
        } catch (error: any) {
            console.error(`Error executing action ${action.id}: ${error.message}`);
        }
    }
}


app.get('/flow', async (req, res) => {
    const { trigger, userEmail } = req.query;

    if (!trigger) return res.status(400).send({ error: 'trigger is required' });
    if (!userEmail) return res.status(400).send({ error: 'userEmail is required' });

    const flow = marketingFlows.find(({ trigger: flowTrigger }) => flowTrigger === trigger);

    if (!flow) return res.status(404).send({ error: 'Flow not found' });

    try {
        await executeActions(flow.actions, userEmail as string);
        res.send({ message: 'Flow executed successfully' });
    } catch (error: any) {
        res.status(500).send({ error: 'Flow execution failed', details: error.message });
    }
});

app.post('/flow', async (req, res) => {
    const {trigger, userEmail, customizations} = req.body;

    if (!trigger) return res.status(400).send({error: 'trigger is required'});
    if (!userEmail) return res.status(400).send({error: 'userEmail is required'});

    const flow: IFlow | undefined = marketingFlows.find(({trigger: flowTrigger}: {
        trigger: string
    }): boolean => flowTrigger === trigger);

    if (!flow) return res.status(404).send({error: 'Flow not found'});

    if (customizations && customizations.actions) {
        flow.actions = customizations.actions.map((customAction: IAction, index: number) => ({
            delay: customAction.delay,
            email: customAction.email,
            id: customAction.id || `action${index + 1}`,
            type: customAction.type
        }));
    }

    try {
        await executeActions(flow.actions, userEmail);
        res.send({message: 'Flow executed successfully'});
    } catch (error: any) {
        res.status(500).send({error: 'Flow execution failed', details: error.message});
    }
});

export {app};
