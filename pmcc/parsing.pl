open F, "</tmp/test" or die "No test data";

while( <F> ) {
	$line .= $_;
}
close F;

$line =~ s//<br\/>/g;
$line =~ s/"/'/g;
$line =~ s/\n//g;

print $line;
