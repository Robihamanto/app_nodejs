var skill = require('./skill');
skill.language = 'PHP';

module.exports = {
    name: '',
    nim: '',
    skill: skill.language,
    print: function(){
        console.log('Name : ' + this.name + ' Skill : ' + this.skill)
    }
}