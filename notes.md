# block chaine

## Block

contain

1. timestem in milliseconds when the block created
2. lastHash the previous block hash
3. block data, could be a string, array or entier object
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

# Prof of Work

it's computational work require from miners in order to add new block
because of any peer can replace the entire blockchain, the blockchain becames vulnerable to malicious acts, so by adding such layer, any try to gain the entire blockchain on 51% of it, is highly computational expensive

## how it Works

because each `block` has it unique `Hash`,
and `Hash` is lang string and could be contain any serises of characters.
Prof of Works requires a special serises in which `Hash` start
usually it **number of sizors** determined by `difficulty` variable

for example if

`difficulty = 6`

then

```javascript
hash = "000000XXXXXXXX...";
```

> doing so without additional data in given block, will produce the same `hash` code each time

to generate random `hash` base on the static block data, an additional variable called `nonce` must added to block data

`nonce` is random number, helps to satisfy the equation

```javascript
Hash(block + nonce) = "0...0XXXXXX...";
```

Finding the right `nonce` that satisfy the equation, takes big computational time, which increase by increasing the `difficulty`

the Difficulty control the rate of adding new blocks to blockchain
