export const DEBUG_MODE = false;

export const API_CONFIG = {
    production : {
    	endpoint: ``
    },

    amazon : {
        endpoint : `http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000`
    },
    development : {
        endpoint : `http://localhost:3000`
    },
	windows: {
		endpoint : `http://ec2-18-188-197-196.us-east-2.compute.amazonaws.com:3000/`
	}
};
