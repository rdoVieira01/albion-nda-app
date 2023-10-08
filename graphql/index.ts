import * as genql from './genql';

const config = useRuntimeConfig();
const { API_URL } = config.public;

const gqlClient = genql.createClient({
  url: API_URL,
});

export default {
  ...gqlClient,
};
