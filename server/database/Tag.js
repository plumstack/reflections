class Tag {
  constructor(client) {
    this.client = client;
  }

  async checkForTag(tag) {
    const SQL = 'SELECT * FROM rs.tags WHERE tag = $1';
    try {
      const tagExists = await this.client.query(SQL, [tag]);
      return tagExists.rowCount ? tagExists.rows[0].id : 0;
    } catch (error) {
      throw new Error(error);
    }
  }

  async insertTag(tag) {
    const SQL = 'INSERT INTO rs.tags (tag) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id';
    const tagID = await this.checkForTag(tag);
    if (!tagID) {
      try {
        const insertedTagID = await this.client.query(SQL, [tag]);
        return insertedTagID.rows[0].id;
      } catch (error) {
        throw new Error(error);
      }
    } else return tagID;
  }
}

module.exports = Tag;
