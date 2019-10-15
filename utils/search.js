import Survey from '../ethereum/survey';
import {getString} from './ipfs';
import factory from '../ethereum/factory';
const Fuse = require("fuse.js");
async function search(value, surveys){
    let list = [];
    for (let i=0;i<surveys.length;i++){
        var summary = await Survey(surveys[i]).methods.getSummary().call();
        list.push({'address':surveys[i],'guestSpeaker':summary[7],'suggestion':summary[8]});
    }
    let options = {
        id:"address",
        threshold:0.1,
        shouldSort: true,
        tokenize: true,
        keys: [{
            name:'guestSpeaker',
            weight:0.5
        },{
            name:'suggestion',
            weight: 0.5
        }]
    }
    let fuse = new Fuse(list,options);
    const result = fuse.search(value);
    console.log(result);
    
    return result;
}
export{search};
