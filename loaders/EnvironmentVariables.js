export default class EnvironmentVariables {
    async load() {
        try {
            const dotenv = await import('dotenv');
            dotenv.config();
        }
        catch(ex){}
    }
}