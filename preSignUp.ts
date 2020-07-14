exports.handler = async (event: any, context: any, callback: any) => {
    event.response.autoConfirmUser = false;
    let address = event.request.userAttributes.email.split("@")
    if (address.length === 2) {
        event.response.autoConfirmUser = true;
    }
    callback(null, event);
};
