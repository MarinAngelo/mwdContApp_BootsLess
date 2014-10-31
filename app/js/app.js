function Person(firstName, lastName) {
	if(!(this instanceof Person)) {
		return new Person(firstName, lastName);
	}
	this.firstName = firstName;
	this.lastName = lastName
};