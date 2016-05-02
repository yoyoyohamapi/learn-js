import {connect} from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

// 映射state到UI层的props
const mapStateToProps = (state, ownProps) => {
    return {
        // active为UI层Link的prop
        active: ownProps.filter === state.visibilityFilter
    }
}

// 映射行为到UI层的行为
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // onClick为UI层的行为
        onClick: ()=> {
            // 某个连接被点击时, 派发一个行为
            dispatch(setVisibilityFilter(ownProps.filter))
        }
    }
}

const FilterLink = connect(
    mapStateToProps,
    mapDispatchToProps
)(Link)

export default FilterLink
