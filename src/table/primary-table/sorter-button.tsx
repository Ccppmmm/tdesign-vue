import mixins from '../../utils/mixins';
import getLocalRecevierMixins from '../../locale/local-receiver';
import { SortType } from '../type';
import { prefix } from '../../config';
import { PropType } from 'vue/types/umd';
import Tooltip from '../../tooltip';
import { Styles } from '../../common';
import isFunction from 'lodash/isFunction';
import TIconChevronDown from '../../icon/chevron-down';

const tooltips = {
  asc: '点击升序',
  desc: '点击降序',
  cancel: '点击取消排序',
};

export default mixins(getLocalRecevierMixins('table')).extend({
  name: `${prefix}-sorter-button`,
  props: {
    sortType: {
      type: String as PropType<SortType>,
      default: null,
    },
    sortOrder: {
      type: String,
      default: (): string => '',
    },
    nextSortOrder: {
      type: String,
      required: false,
    },
  },
  methods: {
    getSortIcon(direction: string, className: string) {
      const icon = isFunction(this.locale.sortIcon)
        ? this.locale.sortIcon(this.$createElement)
        : <TIconChevronDown size='12px' />;
      let style: Styles = {};
      if (direction === 'asc') {
        style = {
          transform: 'rotate(-180deg)',
          ...style,
        };
      }
      const sortClassName = [`${prefix}-table-sort-icon`, className, `${prefix}-table-sort-${direction}`];
      return <span style={style} class={sortClassName}>{icon}</span>;
    },
  },
  render() {
    const { $listeners, sortType, sortOrder, nextSortOrder } = this;
    const allowSortTypes = [];
    if (sortType === 'all') {
      allowSortTypes.push('asc', 'desc');
    } else {
      allowSortTypes.push(sortType);
    }
    const buttonProps = { on: { ...$listeners }, class: allowSortTypes.length > 1 ? `${prefix}-table-double-icons` : '' };
    const tips = tooltips[nextSortOrder];
    const sortButton = allowSortTypes
      .map((direction: string) => {
        const className = direction === sortOrder ? `${prefix}-table-sort-icon-active` : `${prefix}-icon-sort-default`;
        return this.getSortIcon(direction, className);
      });
    return <div class={`${prefix}-table__cell--sort-trigger`} {...buttonProps}>
      {tips ? <Tooltip style="line-height: 0px;" content={tips} showArrow={false}>{sortButton}</Tooltip> : sortButton}
    </div>;
  },
});
