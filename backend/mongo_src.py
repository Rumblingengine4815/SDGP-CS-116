    @classmethod
    def from_mongo(cls):
        """Factory method to initialize engine from MongoDB cloud data."""
        return cls(from_mongo=True)
