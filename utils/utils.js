import Result from './result.js';

export const handleError = (error, logger) => {
    let errorMessage = typeof error === "string" ? error : error.stack;
    
    if(!errorMessage) {
        errorMessage = error.body != null ? error.body.message : 'An error occurred, try again or contact your administrator!';
    }

    if(Array.isArray(errorMessage) && errorMessage[0].message) {
        errorMessage = errorMessage[0].message;
    }

	logger.error('Error: ' + errorMessage);
    return new Result(false, errorMessage);
}

export const generateISODateWithOffset = (date) => {
    let tzo = -date.getTimezoneOffset();
    let dif = tzo >= 0 ? '+' : '-';
	const pad = function(num) {
		var norm = Math.floor(Math.abs(num));
		return (norm < 10 ? '0' : '') + norm;
	};
    
    return date.getFullYear() +
		'-' + pad(date.getMonth() + 1) +
		'-' + pad(date.getDate()) +
		'T' + pad(date.getHours()) +
		':' + pad(date.getMinutes()) +
		':' + pad(date.getSeconds()) +
		dif + pad(tzo / 60) +
		':' + pad(tzo % 60);
}

export const generateDateString = (date) => {   
    const pad = function(num) {
		var norm = Math.floor(Math.abs(num));
		return (norm < 10 ? '0' : '') + norm;
	};
     
    return date.getFullYear() +
		'-' + pad(date.getMonth() + 1) +
		'-' + pad(date.getDate());
}