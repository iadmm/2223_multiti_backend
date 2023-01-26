export const getLatestSlide = (db) => {
  return db.collection("slides").findOne({}, { sort: { position: -1 } });
};

export const getCurrentPlaylist = (db) => {
  return db.collection("playlists").findOne({}, { sort: { created_at: -1 } });
};

export const getSlidesCount = (db)=>{
  return db.collection("slides").countDocuments();
}