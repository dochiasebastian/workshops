export class Permission{
    id: string;

    constructor(public text: string, public type: string) {
        this.type = type;
        this.text = text;
        this.id = text.split(' ')[0].toLowerCase() + randomGenerator();
    }
}

function getRandomID() {
    const used: number[] = [];

    function getNumber() {
        let randomNo = Math.floor(Math.random() * 1000);
        while (used.includes(randomNo)) {
            randomNo = Math.floor(Math.random() * 1000);
        }

        used.push(randomNo);
        return randomNo;
    }
    return getNumber;
}

const randomGenerator = getRandomID();