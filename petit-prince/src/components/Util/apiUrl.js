const node_env = process.env.REACT_APP_NODE_ENV

export const baseUrl = node_env === "dev" ? "http://localhost:3005/api" :
"/api" 