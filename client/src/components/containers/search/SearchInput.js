import React, { Component } from "react";
import { Search } from "semantic-ui-react";

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      selectedUser: {},
      results: [],
      filteredResults: [],
      searchText: ""
    }

    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState){
    const {type, results, selectedUser} = nextProps;
    if (type !== prevState.type && results) {
      const activeResults = results.filter(user => user.type === nextProps.type)
        .map(user => Object.assign({...user, title : `${user.first_name} ${user.last_name}`}));

      if (selectedUser) {
        return {
          results: activeResults,
          type: nextProps.type,
          selectedUser: nextProps.selectedUser,
          searchText: `${selectedUser.first_name} ${selectedUser.last_name}`
        };
      } else {
        return {
          results: activeResults,
          type: nextProps.type,
        };
      }

    }
    return {};
  }

  handleResultSelect(e, { result }) {
    if (result) {
      const { type } = this.state;
      this.setState({
        selectedUser : result,
        searchText: `${result.first_name} ${result.last_name}`
      });
      this.props.handleSearchInputSelect(result, type);
    }
  }

  handleSearchChange(e, { value }) {
    const filteredResults = (this.state.results || [])
      .filter(user =>
        (user.title && user.title.toLowerCase().includes(value.toLowerCase())) ||
        user.email.toLowerCase().includes(value.toLowerCase()));
    this.setState({ searchText: value, filteredResults});
  }

  render() {
    const { filteredResults, results, searchText } = this.state;
    return(
      <div>
        <Search
          onResultSelect={ this.handleResultSelect }
          onSearchChange={ this.handleSearchChange }
          results={ filteredResults || results || [] }
          value={ searchText }
        />
      </div>
    );
  }
}

export default SearchInput;