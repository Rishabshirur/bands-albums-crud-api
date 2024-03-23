// This data file should export all functions using the ES6 standard as shown in the lecture code
import {bands} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../helpers.js';

const exportedMethods = {

  async get(id){
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const bandCollection = await bands();
    const band = await bandCollection.findOne({_id: new ObjectId(id)});
    if (band === null) throw 'No band with that id';
    band._id = band._id.toString();
    return band;
  },
  async create(
    name,
    genre,
    website,
    recordCompany,
    groupMembers,
    yearBandWasFormed
  ){
    if (!name|| !genre|| !website|| !recordCompany|| !groupMembers|| !yearBandWasFormed) throw 'You must provide all the parameters';
    if (typeof name!=='string'|| typeof website!=='string'|| typeof recordCompany!=='string') throw 'Name ,website and recordcompany must be a string';
    if (name.trim().length === 0|| website.trim().length===0|| recordCompany.trim().length===0) throw 'Name or website or recordCompany cannot be an empty string or string with just spaces';
    if (!Array.isArray(genre)|| !Array.isArray(groupMembers)) throw 'genre and groupMembers must be arrays';
    if (genre.length===0 || groupMembers.length===0 ) throw 'You must supply at least one genre and groupmember';
    for (let i in genre) {
      if (typeof genre[i] !== 'string' || genre[i].trim().length === 0) throw 'One or more genre is not a string or is an empty string';
      genre[i] = genre[i].trim();
    }
    for (let i in groupMembers) {
      if (typeof groupMembers[i] !== 'string' || groupMembers[i].trim().length === 0) throw 'One or more groupmembers is not a string or is an empty string';
      groupMembers[i] = groupMembers[i].trim();
    }
    if(typeof yearBandWasFormed!=='number' || (yearBandWasFormed < 1900 || yearBandWasFormed > 2023)) throw 'yearBandWasFormed must be a number between 1900-2023';
    if(!(/^(http:\/\/www\.)[a-zA-Z]{5,}(\.com)$/.test(website))){ throw "invalid website format";}
    name = name.trim();
    website = website.trim();
    recordCompany = recordCompany.trim();

    let newband={
      name: name,
      genre: genre,
      website: website,
      recordCompany: recordCompany,
      groupMembers: groupMembers,
      yearBandWasFormed: yearBandWasFormed,
      albums:[],
      overallRating: 0
    }
    const bandCollection= await bands();
    const insertInfo = await bandCollection.insertOne(newband);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add band';
    const newId = insertInfo.insertedId.toString();
    const band = await this.get(newId);
    return band;
  },

  async getAll(){
    const bandCollection = await bands();
    let bandList = await bandCollection.find({}).project({name:1}).toArray();
    if (!bandList) throw 'Could not get all bands';
    bandList = bandList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return bandList;
  },

  async remove(id){
    if (!id) throw 'You must provide an id to search for';
      if (typeof id !== 'string') throw 'Id must be a string';
      if (id.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
      id = id.trim();
      if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const bandCollection = await bands();
    const deletionInfo = await bandCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });

    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete band with id of ${id}`;
    }
    let obj={
      "bandId": deletionInfo.value._id,
      "deleted": true 
    }
    return obj;
  },

  async update(
    id,
    name,
    genre,
    website,
    recordCompany,
    groupMembers,
    yearBandWasFormed
  ){
    if (!name|| !genre|| !website|| !recordCompany|| !groupMembers|| !yearBandWasFormed) throw 'All fields need to have valid values';
    id = validation.checkId(id, 'ID'); 
    name = validation.checkString(name, 'name');   
    website = validation.checkString(website, 'website');
    recordCompany = validation.checkString(recordCompany, 'recordCompany');
    genre = validation.checkStringArray(genre, 'genre');
    groupMembers = validation.checkStringArray(groupMembers, 'groupMembers');
    if(genre.length==0 ||groupMembers.length==0) throw `must be arrays and must have at least one element in each of them that is a valid string`
    if(typeof yearBandWasFormed!=='number' || (yearBandWasFormed < 1900 || yearBandWasFormed > 2023)) throw 'so only years 1900-2023 are valid values';
    if(!(/^(http:\/\/www\.)[a-zA-Z]{5,}(\.com)$/.test(website))){ throw "invalid website format";}
    
    let band= await this.get(id) 
    let updatedBandData = {
      name:name,
      genre:genre,
      website:website,
      recordCompany:recordCompany,
      groupMembers:groupMembers,
      yearBandWasFormed:yearBandWasFormed,
      albums:band.albums,
      overallRating:band.overallRating
    };
    
    const bandCollection = await bands();    
    const updateInfo = await bandCollection.findOneAndReplace(
      {_id:new ObjectId(id)},
      updatedBandData,
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Error: Update failed! Could not update post with id ${id}`];
    return updateInfo.value;
  }
};
export default exportedMethods;
