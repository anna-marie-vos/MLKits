const outputs = [];

function similarity(point, testPoint) {
  const match = _.chain(point)
    .zip(testPoint)
    .map(([point_y, point_x]) => (point_y - point_x) ** 2)
    .sum()
    .value();

  return match;
}

function splitDataset(data, testCount) {
  const shuffledData = _.shuffle(data);

  const testSet = _.slice(shuffledData, 0, testCount);
  const trainingSet = _.slice(shuffledData, testCount);
  return [testSet, trainingSet];
}

function knnAnalysis(data, testPoint, k) {
  const predictedResult = _.chain(outputs)
    .map(row => {
      return [similarity(_.initial(row), testPoint), _.last(row)];
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

  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(
        testPoint =>
          knnAnalysis(trainingSet, _.initial(testPoint), k) ===
          _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log({ k, accuracy });
  });
}
