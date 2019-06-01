const outputs = [];

const point_x = 300;
const k = 3;

function similarity(point_y, testPoint) {
  const point_x = testPoint[0];
  const match = Math.abs(point_y - point_x);
  return match;
}

function splitDataset(data, testCount) {
  const shuffledData = _.shuffle(data);

  const testSet = _.slice(shuffledData, 0, testCount);
  const trainingSet = _.slice(shuffledData, testCount);
  return [testSet, trainingSet];
}

function knnAnalysis(data, testPoint) {
  const predictedResult = _.chain(outputs)
    .map(row => {
      const bucket = row[3];
      return [similarity(row[0], testPoint), bucket];
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .toNumber()
    .value();

  return predictedResult;
}

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  let predictedCorrectly = 0;
  testSet.map(testPoint => {
    const bucket = knnAnalysis(trainingSet, testPoint);

    if (bucket === testPoint[3]) {
      predictedCorrectly++;
    }
  });
  console.log({ accuracy: predictedCorrectly / testSetSize }, "%");
}
