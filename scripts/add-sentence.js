const fs = require("fs");
const uuid = require("uuid");
const chalk = require("chalk");
const inquirer = require("inquirer");
const version = require("../version.json");
const categories = require("../categories.json");
const path = require("path");

function dump(p, obj) {
  fs.writeFileSync(path.join(__dirname, p), JSON.stringify(obj, undefined, 2));
}

async function add_sentence() {
  const { category } = await inquirer.prompt([
    {
      type: "list",
      choices: categories.map((i) => ({
        name: i.desc,
        value: i.key,
        short: i.name
      })),
      name: "category"
    }
  ]);
  const item = {
    id: version.sentence_id++,
    uuid: uuid.v4(),
    type: category,
    commit_from: "git",
    creator: "anonymous",
    creator_uid: 0,
    reviewer: 0
  };
  const { hitokoto, from, from_who } = await inquirer.prompt([
    {
      type: "input",
      name: "hitokoto",
      validate: Boolean
    },
    {
      type: "input",
      name: "from",
      default: ""
    },
    {
      type: "input",
      name: "from_who",
      default: null
    },
  ]);
  item.hitokoto = hitokoto;
  item.from = from;
  item.from_who = from_who;

  const date = Date.now();

  item.created_at = date;
  item.length = hitokoto.length;

  const cat = require(`../sentences/${category}.json`);
  cat.push(item);
  dump(`../sentences/${category}.json`, cat);
  version.updated_at = date;
  version.categories.timestamp = date;
  version.sentences.find(i => i.key === category).timestamp = date;
  dump("../version.json", version);
  categories.find(i => i.key === category).updated_at = (new Date(date)).toISOString();
  dump("../categories.json", categories);
}

add_sentence();