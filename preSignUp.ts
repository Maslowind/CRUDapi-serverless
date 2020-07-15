import { CognitoUserPoolEvent} from 'aws-lambda';


exports.handler = async (event: CognitoUserPoolEvent) => {
    console.log(event);
    event.response.autoConfirmUser = false;
    let address = event.request.userAttributes.email.split("@")
    if (address.length === 2) {
        event.response.autoConfirmUser = true;
    }
    return event;
};
