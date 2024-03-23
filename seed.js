import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {bandsData} from './data/index.js';
import * as albums from './data/albums.js'
//lets drop the database each time this is run
const db = await dbConnection();
// await db.dropDatabase();

let pinkFloyd = undefined;
let Beatles = undefined;
let LP = undefined;
let eagles = undefined;


async function main() {
    
    try{
        pinkFloyd = await bandsData.create("Pink Floyd", ["Progressive Rock", "Psychedelic Rock", "Classic Rock"], "http://www.pinkfloyd.com", "EMI", ["Roger Waters", "David Gilmour", "Nick Mason", "Richard Wright", "Sid Barrett"], 1965);
        console.log(pinkFloyd);
    }catch(e){ console.log(e)}

    // try{
    //     let see1 = await bands.get(pinkFloyd._id.toString());
    //     console.log(see1);
    // }catch(e){ console.log(e)}

    try{
        Beatles = await bandsData.create("The Beatles",["Rock", "Pop", "Psychedelia"],"http://www.thebeatles.com","Parlophone",["John Lennon", "Paul McCartney", "George Harrison", "Ringo Starr"],1960);
        console.log(Beatles);
    }catch(e){ console.log(e)}
    
    // try{
    //     let show = await bands.getAll();
    //     console.log(show);
    // }catch(e){ console.log(e)}

    try{
        LP = await bandsData.create("Linkin Park", ["Alternative Rock", "Pop Rock", "Alternative Metal"],"http://www.linkinpark.com", "Warner", ["Chester Bennington", "Rob Bourdon", "Brad Delson", "Mike Shinoda", "Dave Farrell", "Joe Hahn"],1996);
        console.log(LP);
    }catch(e){ console.log(e)}

    // try{
    //     let lp = await bands.get(LP._id.toString());
    //     console.log(lp);
    // }catch(e){ console.log(e)}
    
    // try{
    //     pinkFloyd = await bands.rename(pinkFloyd._id.toString(),"Pink F");
    //     console.log(pinkFloyd);
    // }catch(e){ console.log(e)}

    // try{
    //     let lp = await bands.get(pinkFloyd._id.toString());
    //     console.log(lp);
    // }catch(e){ console.log(e)}
    
    // try{
    //     let pf = await bands.remove(Beatles._id.toString());
    //     console.log(pf);
    // }catch(e){ console.log(e)}

    // try{
    //     const pf = await bands.getAll();
    //     console.log(pf);
    // }catch(e){ console.log(e)}

    try{
        eagles = await bandsData.create("The Eagles", ["Progressive Rock", "Psychedelic rock", "Classic Rock"], "http://www.pinkfloyd.com", 467, ["Roger Waters", "David Gilmour", "Nick Mason", "Richard Wright", "Sid Barrett" ], 'kdmfkerf');
        console.log(eagles);
    }catch(e){ console.log(e)}

    // try{
    //     const pf = await bands.remove("63f7e0e4f6af6d046ddaac3d");
    //     console.log(pf);
    // }catch(e){ console.log(e)}

    // try{
    //     const pf = await bands.rename("93f7e0e4f6af6d047ddaac5c","scary cat");
    //     console.log(pf);
    // }catch(e){ console.log(e)}

    // try{
    //     const pf = await bands.rename(pinkFloyd._id.toString(),53445);
    //     console.log(pf);
    // }catch(e){ console.log(e)}

    // try{
    //     const pf = await bands.get("93f7e0e4f6af6d046ddaac4d");
    //     console.log(pf);
    // }catch(e){ console.log(e)}

    await closeConnection();
}
main();