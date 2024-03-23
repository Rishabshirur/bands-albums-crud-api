// This data file should export all functions using the ES6 standard as shown in the lecture code
// import {albums} from '../config/mongoCollections.js';
import {bands} from '../config/mongoCollections.js';
import * as bandsData from './bands.js';
import {ObjectId} from 'mongodb';
import validation from '../helpers.js';

const exportedMethods = {
  async create(
  bandId,
  title,
  releaseDate,
  tracks,
  rating
   ){
  if(!title|| !releaseDate|| !tracks|| !rating){ throw `All fields need to have valid values`}
  title = validation.checkString(title, 'Title');
  releaseDate = validation.checkString(releaseDate, 'Release Date');
  tracks = validation.checkStringArray(tracks, 'Tracks');
  if (tracks.length < 3) { throw `all elements must be strings as well, but there must be AT LEAST 3`;}
  if (!/^(0[1-9]|1[0-2])\/(0[1-9]|(1|2)\d|3[01])\/(19\d{2}|20([0-1]\d|[2][0-4]))$/g.test(releaseDate)) throw 'Invalid date';
  if (typeof rating!== 'number' || rating < 1 || rating > 5 || Math.floor(rating * 10) !== rating * 10){ throw `rating must be a number between 1 and 5 and float with only one decimal place is allowed`}

  const newalbum = {
    _id: new ObjectId(),
    title: title,
    releaseDate: releaseDate,
    tracks:tracks,
    rating:rating
  };

  let band= await bandsData.default.get(bandId);
  let tempAlbums = band.albums;
  tempAlbums.forEach(ele => {
    let flag=false;
    for(let i=0;i<tracks.length;i++){
      if(ele.tracks[i]===tracks[i]){
        flag=true;
      }
    }
    if(ele.title === title && ele.releaseDate===releaseDate && flag && ele.rating===rating){
      throw "Error : album already exists";
    }
  });

  const bandCollection= await bands();
  const insertInfo = await bandCollection.updateOne(
    {_id:new ObjectId(bandId)},
    {$addToSet:{albums:newalbum}}
  );
  if (insertInfo.modifiedCount === 0)
    throw 'Could not add band';
  await this.updatedrating(bandId);
  band= await bandsData.default.get(bandId);
  return band;
},

async getAll(bandId){
  bandId = validation.checkId(bandId, 'Band ID');
  const bandCollection= await bands();
  const bandsList = await bandCollection.findOne({_id:new ObjectId(bandId)})
  if (bandsList === null) throw 'No band with that id';
  const albums = bandsList.albums;
  return albums;
},

async get(albumId){
  albumId = validation.checkId(albumId);
  const bandCollection = await bands();
  const band = await bandCollection.findOne({albums:{$elemMatch:{_id:new ObjectId(albumId)}}});

  if (!band) throw 'Error: album with that albumId doesnt exist';
  let album;
  band.albums.forEach(element => {
    if(element._id.toString()===albumId){
      album=element;
    }
  });
  return album;
},

async remove(albumId){
  albumId = validation.checkId(albumId);
  const bandCollection = await bands();
  const band1 = await bandCollection.findOne({albums:{$elemMatch:{_id:new ObjectId(albumId)}}});
  
  if (!band1) throw 'Error: album with that albumId doesnt exist';
  
  const deletionInfo = await bandCollection.updateOne({_id:new ObjectId(band1._id)},{$pull:{albums:{_id:new ObjectId(albumId)}}});
  if(!deletionInfo){
    throw 'errror';
  }
  if (deletionInfo.modifiedCount == 0)
    throw [404, `Error: Could not delete album with id of ${albumId}`];
  let band= await bandsData.default.get(band1._id.toString());
  await this.updatedrating(band._id);
  return {albumId:albumId, deleted: true};
},
async updatedrating(bandId){
  let sum=0;
  const bandCollection = await bands();
  let tempband=await bandsData.default.get(bandId);
  for(let i in tempband.albums){
    sum+=tempband.albums[i].rating
  }
  if(tempband.albums && tempband.albums.length!==0){
    sum = sum/tempband.albums.length
  }
  await bandCollection.updateOne(
    {_id:new ObjectId(bandId)},
    {$set:{overallRating:sum}}
  );
}
};
export default exportedMethods;
