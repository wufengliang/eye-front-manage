/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-10-24 15:31:28
 * @LastEditTime: 2023-10-28 19:32:36
 * @Description: 问题数据
 */

import { ReactNode } from "react";
import { OperateType } from "./operate.enum";

// const { question, questionFiles, choicePrepares, choiceOptions, answer, choiceMarks } = item;
interface IQuestionDataType {
  question: Record<string, any>;
  questionFiles: any[];
  choicePrepares?: any[];
  choiceOptions?: any[];
  answer?: string;
  choiceMarks?: any[];
  choiceMatrices?: any[];
  index?: number;
}

//  问题传参数据
export interface IQuestionItemType {
  disabled?: boolean;
  hasMask?: boolean;
  isEditMode?: boolean;
  index: number;
  onChange?: (type: OperateType, index: number, data?: Record<string, any>) => void;
  value: IQuestionDataType;
  children?: ReactNode;
}

export interface ISingleBgChoiceType {
  id?: number;
  profileName: string;
  profileOrder?: number;
  profileQuestionId?: number;
  surveyId: number;
}

export interface IProfileQuestion {
  id?: number;
  questionName: string;
  questionOrder?: number;
  surveyId: number;
}

export interface IBgQuestionType {
  choiceProfiles: Array<ISingleBgChoiceType>;
  profileQuestion: IProfileQuestion;
}
