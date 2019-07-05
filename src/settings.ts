/**
 * The settings for the web interface
 * of lxdhub
 */
export interface AppSettings {
    /**
     * The LXDHub backend API url from
     * which the data should be read
     */
    apiUrl: string;
    /**
     * The logging url where the frontend should
     * be logged at. Usually at <API_URL>api/v1/log
     */
    loggingUrl: string;
    /**
     * The port on which the web interface should
     * be run at
     */
    logLevel: string;
    /**
     * The version of the NPM `@lxdhub/web` package
     */
    package_version?: string;
}

export const APP_SETTINGS = 'AppSettings';

