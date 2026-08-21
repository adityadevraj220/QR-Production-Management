const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'license.json');

function init() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(
            FILE_PATH,
            JSON.stringify({
                student: {
                    limit: 5,
                    used: 0
                },
                validity: {
                    validTill: "2099-12-31"
                }
            }, null, 2)
        );
    }
}

function read() {
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

function write(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
    init,
    get() {
        return read();
    },
   incrementStudentCount() {
  const data = read();

  if (!data?.student) {
    console.error('[LICENSE] Invalid license structure:', data);
    return { remaining: 0 };
  }

  data.student.used += 1;
  write(data);

  const remaining = data.student.limit - data.student.used;

  // ✅ Explicit log (server-side)
  console.log(`[LICENSE] Remaining student licenses: ${remaining}`);

  return { remaining };
}

};
