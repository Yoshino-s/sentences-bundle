const fs = require("fs");
const uuid = require("uuid");
const chalk = require("chalk");
const version = require("../version.json");
const package = require("../package.json");
const categories = require("../categories.json");
const data = require("../data/data.json")
const path = require("path");
const crypto = require("crypto");

const creator = data.creator || "anonymous";
const creator_uid = parseInt(crypto.createHash("md5").update(creator).digest("hex").slice(0, 6), 16);
const date = Date.now();

function dump(p, obj) {
  fs.writeFileSync(path.join(__dirname, p), JSON.stringify(obj, undefined, 2));
}

function addCategory(obj) {
  const key = obj.key;
  if (categories.find(c => c.key === key)) {
    throw Error(`Duplicated Key of new Category ${obj.name}`);
  }

  version.sentences.push({
    name: obj.name,
    key: obj.key,
    path: `./sentences/${key}.json`,
    timestamp: date,
  });
  categories.push({
    id: categories.length + 1,
    name: obj.name,
    desc: obj.desc,
    key: obj.key,
    created_at: new Date(date).toISOString(),
    updated_at: new Date(date).toISOString(),
    path: `./sentences/${key}.json`,
  });
  dump(`../sentences/${key}.json`, []);
}

function addSentence(obj) {
  const category = obj.type;
  const item = {
    id: version.sentence_id++,
    uuid: uuid.v4(),
    type: category,
    commit_from: "git",
    creator,
    creator_uid,
    reviewer: 0,
    ...obj
  };
  item.created_at = date;
  item.length = obj.hitokoto.length;
  let cat;
  try {
    cat = require(`../sentences/${category}.json`);
  } catch (e) {
    console.log(chalk.red(`Cannot find type ${category}, maybe you should add it first?`));
  }
  cat.push(item);
  dump(`../sentences/${category}.json`, cat);
  version.sentences.find(i => i.key === category).timestamp = date;
  categories.find(i => i.key === category).updated_at = (new Date(date)).toISOString();
  console.log(chalk.green(`Success add ${obj.hitokoto}`));
}

function main() {
  for (let i of (data.categories || [])) {
    addCategory(i);
  }
  for (let i of (data.sentences || [])) {
    addSentence(i);
  }
  version.updated_at = date;
  version.categories.timestamp = date;
  dump("../version.json", version);
  dump("../categories.json", categories);
}

main();