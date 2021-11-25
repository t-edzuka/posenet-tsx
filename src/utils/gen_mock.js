const farmworkClasses = ["定植", "誘引", "芽かき", "収穫", "片付け", "農薬散布", "播種"]
const poseClasses = ["立ち作業", "座り作業", "中腰作業"]

/**
 * 配列の値からランダムで1つ選択して返す
 * @param {string[]} arr  選択する配列の内容
 * @return string
 */
export function chooseRandom(arr = farmworkClasses) {
    const arrayIndex = Math.floor(Math.random() * arr.length);
    return arr[arrayIndex];
}

export const chooseFarmwork = () => {
    return chooseRandom(farmworkClasses);
}

export const choosePoseClasses = () => {
    return chooseRandom(poseClasses);
}


