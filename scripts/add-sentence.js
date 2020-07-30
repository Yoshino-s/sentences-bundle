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

async function query() {
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
  return {
    hitokoto,
    from,
    from_who
  }
}

async function addSentence(obj) {
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
    reviewer: 0,
    ...obj
  };

  const date = Date.now();

  item.created_at = date;
  item.length = obj.hitokoto.length;

  const cat = require(`../sentences/${category}.json`);
  cat.push(item);
  dump(`../sentences/${category}.json`, cat);
  version.updated_at = date;
  version.categories.timestamp = date;
  version.sentences.find(i => i.key === category).timestamp = date;
  dump("../version.json", version);
  categories.find(i => i.key === category).updated_at = (new Date(date)).toISOString();
  dump("../categories.json", categories);
  console.log(chalk.green(`Success add ${obj.hitokoto}`))
}

query().then(addSentence);