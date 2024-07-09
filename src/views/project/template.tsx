/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-22 11:58:37
 * @LastEditTime: 2024-07-09 17:20:29
 * @Description: 项目创建模板内容
 */
import { forwardRef, useImperativeHandle, Ref, useRef } from "react";
import { Form, Input, Radio, DatePicker, Row, Col, Checkbox, Button } from "antd";
import zhCN from "antd/es/date-picker/locale/zh_CN";

function ProjectTemplate(props: Record<string, any> = {}, ref?: Ref<unknown>) {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [form] = Form.useForm();

  const questionGroups = Form.useWatch("questionGroups", form);
  const isRandom = Form.useWatch("answerRandom", form);

  useImperativeHandle(
    ref,
    () => {
      return {
        validate() {
          return form.validateFields();
        },
      };
    },
    []
  );

  /**
   * 添加产品
   */
  const addQuesitionGroup = () => {
    const newQuestionGroups = [
      ...questionGroups,
      { groupName: `产品${questionGroups.length + 1}`, random: false },
    ];
    // form.setFieldValue("questionGroups", [
    //   { groupName: `产品${questionGroups.length + 1}`, random: false },
    // ]);
    form.setFieldValue("questionGroups", newQuestionGroups);
  };

  return (
    <div>
      <Form
        form={form}
        {...(props?.layout || layout)}
        initialValues={{ ...props, questionGroups: props.questionGroups || [] }}
      >
        <Form.Item
          label="问卷标题"
          name="title"
          rules={[{ required: true, message: "请输入问卷标题" }]}
        >
          <Input placeholder="请输入问卷标题..." />
        </Form.Item>
        <Form.Item
          label="问卷开始语"
          name="startTips"
          rules={[{ required: true, message: "请输入问卷开始语" }]}
        >
          <Input placeholder="请输入问卷开始语..." />
        </Form.Item>
        <Form.Item
          label="问卷结束语"
          name="endTips"
          rules={[{ required: true, message: "请输入问卷结束语" }]}
        >
          <Input placeholder="请输入问卷结束语.." />
        </Form.Item>
        <Form.Item
          label="投放开始时间"
          name="startTime"
          rules={[{ required: true, message: "请选择投放开始时间" }]}
        >
          <DatePicker
            showTime
            placeholder="请输入投放开始时间.."
            locale={zhCN}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="投放结束时间"
          name="endTime"
          rules={[{ required: true, message: "请选择投放结束时间" }]}
        >
          <DatePicker
            showTime
            placeholder="请输入投放结束时间.."
            locale={zhCN}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="问卷口令" name="password">
          <Input.Password placeholder="请输入问卷口令.." />
        </Form.Item>
        <Form.Item
          label="是否是眼动项目"
          name="isYanDong"
          rules={[{ required: true, message: "请选择是否是眼动项目" }]}
        >
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="是否是横版问卷"
          name="locationType"
          rules={[{ required: true, message: "请选择是否是横版问卷" }]}
        >
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item label='是否随机' name='answerRandom' rules={[{ required: true, message: '请选择是否是随机' }]}>
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item> */}
        {/* {(!questionGroups || (questionGroups && questionGroups.length === 0)) ? (
          <Button type='primary' size='small' onClick={() => addQuesitionGroup()}>添加产品</Button>
        ) : null} */}
        {!props.disabled ? (
          <Button type="primary" size="small" onClick={() => addQuesitionGroup()}>
            添加产品
          </Button>
        ) : null}
        <Form.List name="questionGroups">
          {(fields, { add, remove }) => {
            const questionGroups = form.getFieldValue("questionGroups");
            const nodes = fields.map((field, index) => {
              return (
                <Row justify="center" className="mt-2" key={field.name}>
                  <Col span={8}>
                    <Form.Item
                      name={[field.name, "groupName"]}
                      rules={[{ required: true, message: "请输入产品名" }]}
                    >
                      <Input disabled={props.disabled} placeholder="产品名" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={[field.name, "random"]} valuePropName="checked">
                      <Checkbox disabled={props.disabled} defaultChecked={false} />
                    </Form.Item>
                  </Col>
                  {props.disabled ? null : (
                    <Col span={4}>
                      {/* <Button size='small' className='ml-1 mb-1' type='primary' onClick={() => add({ groupName: `产品${questionGroups.length + 1}`, random: false })}>添加产品</Button> */}
                      {/* {fields.length > 1 ? <Button size='small' danger className='ml-1' onClick={() => remove(index)}>移除产品</Button> : null} */}
                      {
                        <Button size="small" danger className="ml-1" onClick={() => remove(index)}>
                          移除产品
                        </Button>
                      }
                    </Col>
                  )}
                </Row>
              );
            });

            const header = (
              <Row justify="center">
                <Col span={8}>产品名</Col>
                <Col span={8}>是否随机</Col>
                {props.disabled ? null : <Col span={4}>操作</Col>}
              </Row>
            );

            return (
              <>
                {questionGroups && questionGroups?.length > 0 ? header : null}
                {nodes}
              </>
            );
          }}
        </Form.List>
      </Form>
    </div>
  );
}

export default forwardRef(ProjectTemplate);
