open F, "</tmp/test" or die "No test data";

while( <F> ) {
	$line .= $_;
}
close F;

$line =~ s/
$line =~ s/"/'/g;
$line =~ s/\n//g;

print $line;