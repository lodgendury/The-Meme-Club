use anchor_lang::prelude::*;


declare_id!("CFCdgxTd9GsY9BfRvwfYxZzMQfFWcBvAYYZhDdjfmxGp");


#[program]
pub mod myepicproject {
  use super::*;
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs = 0;
    
    
    Ok(())
  }
   // The function now accepts a gif_link param from the user. We also reference the user from the Context
   pub fn add_gif(ctx: Context<AddGif>, gif_link: String, _check: bool, show_tip: bool, _likes: String, _id: String) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

    let clock = Clock::get().unwrap();

    let likes_string = _likes.to_string();  // `parse()` works with `&str` and `String`!
    let my_likes = likes_string.parse::<u64>().unwrap();

	// Build the struct.
    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
      _check: _check,
      _id: _id.to_string(),
      my_likes: my_likes,
      timestamp: clock.unix_timestamp,
      show_tip: show_tip,
      tip: 0,
    };
		
	// Add it to the gif_list vector.
    base_account.gif_list.push(item);
    base_account.total_gifs += 1;
    Ok(())
  }
  
  pub fn upvote_gif(ctx: Context<UpvoteGif>, _upvote: bool, gif_id: u16) -> Result <()> {
     

    if _upvote == true {
      let item = &mut ctx.accounts.base_account.gif_list[usize::from(gif_id)];
      item.my_likes += 1;
      item._check = true;
    } else {
        let item = &mut ctx.accounts.base_account.gif_list[usize::from(gif_id)];
        item.my_likes -= 1;
        item._check = false;
      }
    
    Ok(())
}

pub fn send_sol(ctx: Context<SendSol>, amount: String, gif_id: u16) -> Result <()> {
       
  let base_account = &mut ctx.accounts.base_account;

  let tip_string = amount.to_string();  // `parse()` works with `&str` and `String`!
    let my_tip = tip_string.parse::<u64>().unwrap();

    if my_tip > 0 {
  
  let ix = anchor_lang::solana_program::system_instruction::transfer(
      &ctx.accounts.from.key(),
      &ctx.accounts.to.key(),
      my_tip.into(),
  );
        
          anchor_lang::solana_program::program::invoke(
    &ix,
    &[
      ctx.accounts.from.to_account_info(),
      ctx.accounts.to.to_account_info(),
    ]
  );

  
      
      let item = &mut ctx.accounts.base_account.gif_list[usize::from(gif_id)];
      item.tip += 1;

}
  Ok(())
  
}

  // The function now accepts a gif_link param from the user. We also reference the user from the Context
  pub fn remove_gif(ctx: Context<RemoveGif>, _index: u16) -> Result <()> {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

    //let my_string = _index.to_string();  // `parse()` works with `&str` and `String`!
    //let my_int = my_string.parse::<u64>().unwrap();

    base_account.gif_list.remove(_index.try_into().unwrap());
    base_account.total_gifs -= 1;
    
    Ok(())
  }
}


#[derive(Accounts)]
pub struct StartStuffOff<'info> {
  #[account(init, payer = user, space = 9000)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

// Add the signer who calls the AddGif method to the struct so that we can save it
#[derive(Accounts)]
pub struct AddGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program <'info, System>,
}

#[derive(Accounts)]
pub struct RemoveGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpvoteGif<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct SendSol<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub from: Signer<'info>,
  #[account(mut)]
  pub to: AccountInfo<'info>,
  pub system_program: Program <'info, System>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub _check: bool,
    pub _id: String,
    pub my_likes: u64,
    pub timestamp: i64,
    pub show_tip: bool,
    pub tip: u64,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
	// Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>,
}

