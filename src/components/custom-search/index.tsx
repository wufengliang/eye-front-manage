/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-09-21 17:14:27
 * @LastEditTime: 2023-09-22 11:03:51
 * @Description: 自定义搜索
 */
import { forwardRef, Ref, useRef, useImperativeHandle } from 'react';
import { Form, Col, Row, Input, InputNumber, Select, DatePicker, Button } from 'antd';
import { ICustomSearchType, ICustomSearchItem } from './type';

function CustomSearch(props: ICustomSearchType = { columns: [] }, cref?: Ref<unknown>) {
  const { columns, showReset = true, showSearch = true, loading, singleSpan = 8, disabled = false, onSearch, onReset } = props;
  const initValue = columns.reduce((prev, next) => (prev[next.name!] = next.defaultValue, prev), {} as Record<string, any>)

  const [form] = Form.useForm();

  useImperativeHandle(cref, () => {
    return {
      form,
    }
  });

  //  渲染单项搜索区域
  const renderSingleItem = (item: ICustomSearchItem) => {
    const {
      type,
      name,
      label,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      placeholder,
      showClear = true,
      style,
      dataSource = [],
      renderSingle
    } = item;

    if (!name) {
      throw Error(`当前搜索渲染项${type}缺失${name}字段`);
    }

    if (['Select'].includes(type) && !renderSingle) {
      throw Error(`当前搜索渲染项${name}缺失renderSingle自定义渲染函数`);
    }

    const commonProps = {
      allowClear: showClear,
      placeholder,
      disabled,
      style,
      max,
      min,
    }

    return (
      <Form.Item
        name={name}
        label={label}
        key={name}
      >
        {
          (!type || type === 'Input') ?
            <Input {...commonProps} /> :
            (type === 'InputNumber' ?
              <InputNumber {...commonProps} /> :
              (type === 'Select' ?
                <Select {...commonProps}>
                  {dataSource.map((item) => renderSingle!(item as unknown))}
                </Select> :
                <DatePicker {...commonProps} />)
            )
        }
      </Form.Item>
    )
  }

  /**
   * @desc 渲染button集合的容器
   */
  const renderButtonContainer = () => {
    return (
      <>
        {columns.length > 1 ?
          <Row justify={'end'}>{renderButtonBox()}</Row> :
          <Col span={singleSpan}>
            {renderButtonBox()}
          </Col>
        }
      </>
    )
  }

  const renderButtonBox = () => {
    return (
      <>
        {
          showSearch ?
            <Button type='primary' className='margin-right-5 margin-bottom-5' htmlType='submit' loading={loading}>查询</Button>
            : null
        }
        {
          showReset ?
            <Button htmlType='reset' className='margin-bottom-5' onClick={() => onReset && onReset()}>清空</Button>
            : null
        }
      </>
    )
  }

  const onFinish = (value: Record<string, unknown>) => {
    onSearch && onSearch(value);
  }

  return (
    <>
      <Form
        form={form}
        name='form'
        layout='inline'
        initialValues={initValue}
        onFinish={onFinish}
      >
        {columns.map(renderSingleItem)}
        {renderButtonContainer()}
      </Form>
    </>
  )
}

export default forwardRef(CustomSearch);
