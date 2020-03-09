# block chaine

## Block

contain

1. timestem in milliseconds when the block created
2. lastHash the previous block hash
3. blok data, could be a string, array or entier object
4. hash, that signate such new block

### Genesis block

is the _only_ first **hard coded block** in the chaine,
because each back require previous hash, a Genesis block must exist firstly in the chain

## Block chain

its a class that contain all blocks related to each other through a hash
the first block is the Genesis and
such class has a method to add new block passing only the block data

### Multiple chain Validation

each minner has his own version of the block chain

and therefore the chain will be come no longer consistent
for that we need each time to accept only the **longest chain** produced by certin mainner
