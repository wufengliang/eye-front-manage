/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-24 15:31:28
 * @LastEditTime: 2023-10-24 15:39:30
 * @Description: 问题数据
 */

// const { question, questionFiles, choicePrepares, choiceOptions, answer, choiceMarks } = item;
interface IQuestionDataType {
  question: Record<string, any>;
  questionFiles: any[];
  choicePrepares?: any[];
  choiceOptions?: any[];
  answer?: string;
  choiceMarks?: any[];
  index: number;
}

//  问题传参数据
export interface IQuestionItemType extends IQuestionDataType {
  disabled?: boolean;
}
