import request from 'supertest';
import {app} from './app';

let server: any;

beforeAll((done) => {
    server = app.listen(3001, () => done());
});

afterAll((done) => {
    server.close(done);
    jest.resetAllMocks();
});

describe('Marketing Flows', () => {
    it('should trigger websiteSignup flow without customizations', async () => {
        const response = await request(server)
            .post('/flow')
            .send({ trigger: 'websiteSignup', userEmail: 'harmony@healthtech1.uk' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Flow executed successfully');
    });

    it('should trigger websiteSignup flow with customizations', async () => {
        const customActions = [
            {
                delay: 500,
                id: 'customAction1',
                type: 'delay'
            },
            {
                email: {
                    body: 'The Nights Watch',
                    subject: 'King of the North'
                },
                id: 'customAction2',
                type: 'email'
            }
        ];
        const response = await request(server)
            .post('/flow')
            .send({ trigger: 'websiteSignup', userEmail: 'harmony@healthtech1.uk', customizations: { actions: customActions } });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Flow executed successfully');
    });

    it('should return 404 for invalid trigger', async () => {
        const response = await request(server)
            .post('/flow')
            .send({ trigger: 'invalidTrigger', userEmail: 'harmony@healthtech1.uk' });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Flow not found');
    });

    it('should return 400 for missing userEmail', async () => {
        const response = await request(server)
            .post('/flow')
            .send({ trigger: 'websiteSignup' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('userEmail is required');
    });

    it('should handle delay', async () => {
        const start = Date.now();
        const customActions = [
            {
                delay: 500,
                id: 'customAction1',
                type: 'delay'
            }
        ];
        const response = await request(server)
            .post('/flow')
            .send({ trigger: 'websiteSignup', userEmail: 'harmony@healthtech1.uk', customizations: { actions: customActions } });

        const duration = Date.now() - start;
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Flow executed successfully');
        expect(duration).toBeGreaterThanOrEqual(500);
    });


    it('should handle empty actions array', async () => {
        const response = await request(server)
            .post('/flow')
            .send({ trigger: 'websiteSignup', userEmail: 'harmony@healthtech1.uk', customizations: { actions: [] } });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Flow executed successfully');
    });
});
