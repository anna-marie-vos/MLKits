const outputs = [];

const point_x = 300;
const k = 3;

function similarity(point_y) {
  const match = Math.abs(point_y - point_x);
  return match;
}

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const predictionResult = _.chain(outputs)
    .map(row => {
      const bucket = row[3];
      return [similarity(row[0]), bucket];
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .toString()
    .value();

  console.log(predictionResult);
}
