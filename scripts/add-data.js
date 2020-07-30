const fs = require("fs");
const uuid = require("uuid");
const chalk = require("chalk");
const inquirer = require("inquirer");
const version = require("../version.json");
const categories = require("../categories.json");
const data = require("../data/data.json")
const path = require("path");
const crypto = require("crypto");

const creator = data.creator || "anonymous";
const creator_uid = parseInt(crypto.createHash("md5").update(creator).digest("hex").slice(0, 6), 16);

function dump(p, obj) {
  fs.writeFileSync(path.join(__dirname, p), JSON.stringify(obj, undefined, 2));
}

async function addSentence(obj) {
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

  const date = Date.now();

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
  version.updated_at = date;
  version.categories.timestamp = date;
  version.sentences.find(i => i.key === category).timestamp = date;
  dump("../version.json", version);
  categories.find(i => i.key === category).updated_at = (new Date(date)).toISOString();
  dump("../categories.json", categories);
  console.log(chalk.green(`Success add ${obj.hitokoto}`));
}

async function main() {
  for (let i of data.sentences) {
    await addSentence(i);
  }
}

main();