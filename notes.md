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
## dynamic Difficulty

in order to stop mining blocks to fast or help to speed up the slowly mined block, a dynamic difficulty must exist

-   increase the **difficulty** if the difference between current block timestamp - previous block timestamp is **longer** than `MINI_RATE`

-   lowers the difficulty if **difference** between current block timestamp - previous block timestamp is **less** than `MINI_RATE`

each block must include its difficulty in its data because of the dynamic system relay on adjusting the previous block difficulty to be current block difficulty

> only **geneses block** will takes a **constant difficulty**

therefor the difficulty could grow to be much big then the starting difficulty (geneses block difficulty), and could decrease to be **0**.
but such **changes** of difficulty happen by **1** or **-1** **for each block**

there is a conjunction between the generated hash and difficulty

-   the difficulty is included in the block hash
-   each hash must start by the difficulty number of zeros

```javascript
const timestampDifference = block.timestamp - prev.timestamp;
const difficulty =
    prev.difficulty + (timestampDifference >= MINI_RATE ? -1 : 1);

if (
    difficulty === block.difficulty &&
    block.hash.substr(0, difficulty) === "0".repeat(difficulty)
)
    return "Valide";
```
